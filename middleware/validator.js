const fieldValidator = (fields) => (res, req) => {
  const missingFields = Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }
};
