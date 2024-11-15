import { Stack, Box } from "@chakra-ui/layout";
import { Skeleton, SkeletonCircle } from "@chakra-ui/skeleton";

const ChatTileLoading = () => {
  return (
    <Box
      padding="3px 10px"
      borderRadius="10px"
      backgroundColor="#3a404e"
    >
      <Stack
        direction="row"
        alignItems="center"
        padding="10px"
        gap="1rem"
      >
        <SkeletonCircle size="50px"
        />
        <Stack spacing="10px">
          <Skeleton height="16px" width="100px" />
          <Skeleton height="10px" width="80px" />
        </Stack>
      </Stack>
    </Box>
  );
};

const ChatLoading = () => {
  return (
    <Stack>
      {Array(4).fill(0).map((_, i) => (
        <ChatTileLoading key={i} />
      ))}
    </Stack>
  );
};

export default ChatLoading;
