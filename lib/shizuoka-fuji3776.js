const DEFAULT_VALUE = Object.freeze({
  campaignId: "ea8edf81-2d6c-4eaf-9b71-ac6af2edc48c",
  totalLikes: 0,
  totalPosts: 0
});

function validateValue(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "JSON object is required." };
  }

  const campaignId = input.campaignId;
  const totalLikes = input.totalLikes;
  const totalPosts = input.totalPosts;

  if (
    typeof campaignId !== "string" ||
    campaignId.trim().length === 0 ||
    campaignId.length > 200
  ) {
    return { error: "campaignId must be a non-empty string of 200 characters or fewer." };
  }

  if (!Number.isSafeInteger(totalLikes) || totalLikes < 0) {
    return { error: "totalLikes must be a non-negative integer." };
  }

  if (!Number.isSafeInteger(totalPosts) || totalPosts < 0) {
    return { error: "totalPosts must be a non-negative integer." };
  }

  return {
    value: {
      campaignId: campaignId.trim(),
      totalLikes,
      totalPosts
    }
  };
}

module.exports = { DEFAULT_VALUE, validateValue };
