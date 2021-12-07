export const generateWalletAddress = () =>
  `${Math.ceil(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}`;
