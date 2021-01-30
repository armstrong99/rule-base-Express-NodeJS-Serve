const { errorMsg, fieldRes } = require("../Errors/response");
const Joi = require("joi");
const validateSchema = require("../helperFlutterAPI/validateField");

//ensure that the req has a rule, conditions and data field exists
// .pattern(/(([a-z]*[.]+[a-z]*){1,2})/, /[a-z]*/)

const Schema = Joi.object({
  rule: Joi.object({
    field: Joi.string().required(),
    condition: Joi.string().valid("eq", "neq", "gt", "gte", "contains"),
    condition_value: Joi.any().required(),
  }),
  data: Joi.alternatives()
    .try(Joi.object(), Joi.array(), Joi.string())
    .required(),
});

let ruleX, dataX;

exports.validateJson = async (req, res) => {
  try {
    const { data, rule } = await Schema.validateAsync(req.body);
    ruleX = rule;
    dataX = data;
    let ans = validateSchema(rule, data, res);
    fieldRes(
      {
        message: ans,
        status: "success",
        data: {
          validation: {
            error: false,
            ...rule,
            field_value: data[rule.field],
          },
        },
      },
      res
    );
  } catch (err) {
    if (err.message.includes("validation")) {
      errorMsg(
        {
          message: err.message + ".",
          status: "error",
          data: {
            validation: {
              error: true,
              ...ruleX,
              field_value: dataX[ruleX.field],
            },
          },
        },
        res
      );
    } else
      errorMsg(
        { message: err.message + ".", status: "error", data: null },
        res
      );
  }
};
