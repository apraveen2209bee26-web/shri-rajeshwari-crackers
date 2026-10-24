const createOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const randomPart = Math.floor(Math.random() * 9000 + 1000);
  return `CRK-${timestamp}-${randomPart}`;
};

export default createOrderNumber;

