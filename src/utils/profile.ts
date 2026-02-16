export function buildProfileContext(profile: any): string {
  if (!profile) return "";
  return `
    User Profile:
    - Current Role: ${profile.currentRole ?? "Unknown"}
    - Target Role: ${profile.targetRole ?? "Unknown"}
    - Experience: ${profile.experienceYears ?? "Unknown"} years
    - Skills: ${profile.skills?.join(", ") || "None"}
    - Interests: ${profile.interests?.join(", ") || "None"}
    - Goals: ${profile.goals ?? "Not specified"}
    - Industry: ${profile.industry ?? "Not specified"}
    - Location: ${profile.location ?? "Not specified"}
`;
}
