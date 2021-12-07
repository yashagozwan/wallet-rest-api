//* METHOD GET
//* GET ACCOUNT
//* URL: /account
export const getAccount = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.account });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
