export const USER_QUERY_KEY = "userDetails";

export const useUserDetails = () => {
  const { user } = useUser();
  // const { data: userDetails, isLoading } = useQuery(
  //   ["userDetails", user?.address],
  //   async () => {
  //     if (!user?.address) return null;
  //     const response = await fetch(`/api/user/${user.address}`);
  //     if (!response.ok) throw new Error("Failed to fetch user details");
  //     return response.json();
  //   },
  //   {
  //     enabled: !!user?.address,
  //   },
  // );
  //
  // return { userDetails, isLoading };
};
