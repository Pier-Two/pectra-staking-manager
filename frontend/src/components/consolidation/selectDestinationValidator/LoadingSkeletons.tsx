const LoadingSkeletons = () => (
  <>
    {[1, 2, 3].map((index) => (
      <div
        key={`loading-${index}`}
        className="mb-2 h-24 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
      />
    ))}
  </>
);

export default LoadingSkeletons;
