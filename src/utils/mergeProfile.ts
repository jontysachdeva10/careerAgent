function mergeProfile(existing: any = {}, extracted: any = {}) {
  return {
    currentRole: extracted.currentRole || existing.currentRole,
    targetRole: extracted.targetRole || existing.targetRole,
    experienceYears: extracted.experienceYears ?? existing.experienceYears,
    goals: extracted.goals || existing.goals,
    education: extracted.education || existing.education,
    industry: extracted.industry || existing.industry,
    location: extracted.location || existing.location,

    skills: [
      ...new Set([...(existing.skills ?? []), ...(extracted.skills ?? [])]),
    ],
    interests: [
      ...new Set([
        ...(existing.interests ?? []),
        ...(extracted.interests ?? []),
      ]),
    ],
  };
}

export default mergeProfile;
