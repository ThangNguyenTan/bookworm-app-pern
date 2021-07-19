export const calculateTotalReviews = (reviewsStatus) => {
  let sum = 0;
  for (let i = 1; i <= 5; i++) {
    const element = reviewsStatus[`numberOf${i}StarReviews`];
    sum += parseInt(element);
  }
  return sum;
};
