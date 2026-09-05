const { Bvn } = require("../models/bvn.model");
const { Nin } = require("../models/nin.model");
const { User } = require("../modules/users/user.model");
const {
  nibssBvnCreation,
  nibssNinCreation,
  nibssAccountCreation,
  nibssGetAllBankAccounts,
} = require("../services/nibss.service");
const { validateRequiredFields } = require("../utils/helper");

const adminCreateBankAccount = async (req, res) => {
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
      [kycType]: kycID,
      accountNumber: accountData.account.accountNumber,
      accountName: accountData.account.accountName,
      bankCode: accountData.account.bankCode,
      balance: accountData.account.balance,
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

const adminCreateBvn = async (req, res) => {
  const { firstName, lastName, dob, bvn, phone } = req.body;
  const requiredFields = { firstName, lastName, dob, bvn, phone };
  const missingFields = validateRequiredFields(requiredFields);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const payload = { firstName, lastName, dob, bvn, phone };
    const data = await nibssBvnCreation(payload);
    await Bvn.create(payload);
    return res.status(201).json({
      success: true,
      message: "Bvn created Successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.error || error.message || "Failed to create Bvn",
    });
  }
};

const adminCreateNin = async (req, res) => {
  const { firstName, lastName, dob, nin } = req.body;
  const requiredFields = { firstName, lastName, dob, nin };
  const missingFields = validateRequiredFields(requiredFields);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const payload = { firstName, lastName, nin, dob };
    const data = await nibssNinCreation(payload);
    await Nin.create(payload);
    return res.status(201).json({
      success: true,
      message: "Nin created Successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.error || error.message || "Failed to create Bvn",
    });
  }
};

const adminGetAllAccounts = async (req, res) => {
  try {
    const data = await nibssGetAllBankAccounts();
    return res.status(200).json({
      success: true,
      message: "Successful",
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.error || error.message || "Failed to create Bvn",
    });
  }
};

module.exports = {
  adminCreateBankAccount,
  adminCreateBvn,
  adminCreateNin,
  adminGetAllAccounts,
};
