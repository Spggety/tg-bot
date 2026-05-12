export function extractNumbers(data) {
  return (
    data?.availableForAdd?.flatMap(item =>
      item?.numbersInfo?.map(n => n.number) || []
    ) || []
  );
}