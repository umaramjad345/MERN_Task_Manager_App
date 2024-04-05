export const sendToken = (message, user, res, statusCode) => {
  const token = user.getJWTToken();
  const { password, ...rest } = user._doc;

  const options = {
    expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, rest, message, token });
};
