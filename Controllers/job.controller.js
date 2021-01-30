exports.profile = async (req, res) => {
  res.status(200).send({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Ndukwe Armstrong",
      github: "@armstrong99",
      email: "armstrong.ndukwe@gmail.com",
      mobile: "09056471616",
      twitter: "@AI_Lift",
    },
  });
};

exports.validate_rule = async (req, res) => {
  try {
  } catch (error) {}
};
