export const getDefaultChecks = (user, currency) => {
  return [
    {
      user,
      name: "Основной",
      amount: 0,
      currency,
    },
  ];
};
