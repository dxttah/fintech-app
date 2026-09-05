const { Bvn } = require("../../models/bvn.model");
const { Nin } = require("../../models/nin.model");
const {
  nibssAccountCreation,
  nibssNinValidation,
  nibssBvnValidation,
} = require("../../services/nibss.service");
const { handleServerError, omit, normalizeDob, validateRequiredFields } = require("../../utils/helper");
const { User } = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    phone,
    kycType,
    kycID,
    dob,
  } = req.body;
  const requiredFields = {
    kycType,
    kycID,
    dob,
    firstName,
    lastName,
    password,
    gender,
    email,
    phone,
  };
  const missingFields = validateRequiredFields(requiredFields);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const isKycNin = kycType === "nin";
  const accountCreationPayload = { kycType, kycID, dob };
  const dbKycValidation = isKycNin ? Nin : Bvn;
  const kycValidationApi = isKycNin ? nibssNinValidation : nibssBvnValidation;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const dbKyc = await dbKycValidation.findOne({ [kycType]: kycID });
    if (dbKyc) {
      if (
        dbKyc.firstName !== firstName ||
        dbKyc.lastName !== lastName ||
        normalizeDob(dbKyc.dob) !== normalizeDob(dob) ||
        (kycType === "bvn" && dbKyc.phone !== phone)
      ) {
        return res.status(400).json({
          message: `${kycType} details do not match user details. Kindly provide a correct ${kycType}.`,
          compare: {
            firstName: `${dbKyc.firstName}, ${firstName}`,
            lastName: `${dbKyc.lastName}, ${lastName}`,
            dob: `${normalizeDob(dbKyc.dob)}, ${normalizeDob(dob)}`,
            phone: `${dbKyc.phone}, ${phone}`,
          },
        });
      }
    } else {
      const nibssKyc = await kycValidationApi({ [kycType]: kycID });

      if (nibssKyc?.success) {
        if (
          nibssKyc.data.firstName !== firstName ||
          nibssKyc.data.lastName !== lastName ||
          normalizeDob(nibssKyc.data.dob) !== normalizeDob(dob) ||
          (kycType === "bvn" && nibssKyc.data.phone !== phone)
        ) {
          return res.status(400).json({
            message: `${kycType} details do not match user details. Kindly provide a correct ${kycType}.`,
            compare: {
              firstName: `${nibssKyc.data.firstName}, ${firstName}`,
              lastName: `${nibssKyc.data.lastName}, ${lastName}`,
              dob: `${normalizeDob(nibssKyc.data.dob)}, ${normalizeDob(dob)}`,
              phone: `${nibssKyc.data.phone}, ${phone}`,
            },
          });
        }
      }
    }

    const accountData = await nibssAccountCreation(accountCreationPayload);
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      dob,
      firstName,
      lastName,
      email,
      phone,
      gender,
      password: hashedPassword,
      kycType,
      kycID,
      accountNumber: accountData.account.accountNumber,
      bankName: accountData.account.bankName,
      bankCode: accountData.account.bankCode,
    };

    const user = await User.create(data);

    return res
      .status(201)
      .json({ data: user, message: "User created successfully" });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.error || error.message || "Failed to create user",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        gender: existingUser.gender,
        phone: existingUser.phone,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30h" },
    );

    return res.status(200).json({
      data: omit(existingUser.toObject(), ["password"]),
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

module.exports = { createUser, loginUser };
