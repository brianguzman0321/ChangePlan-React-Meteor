export const getNumberOfStakeholders = (allStakeholders, currentStakeholders) => {
  let totalCount = 0;
  let totalAllStakeholders = 0;
  allStakeholders.forEach(stakeholder => {
      totalAllStakeholders = stakeholder.numberOfPeople > 0 ? totalAllStakeholders + stakeholder.numberOfPeople : totalAllStakeholders + 1;
  });
  if (currentStakeholders.length > 0) {
    const selectedStakeholders = allStakeholders.filter(stakeholder => currentStakeholders.includes(stakeholder._id));
    selectedStakeholders.forEach(stakeholder => {
      totalCount = stakeholder.numberOfPeople > 0 ? totalCount + stakeholder.numberOfPeople : totalCount + 1;
    });
  }
  return `${totalCount} of ${totalAllStakeholders}`;
};

export const getTotalStakeholders = (allStakeholders, currentStakeholders) => {
  let totalStakeholders = 0;
  let stakeholders = allStakeholders.filter(stakeholder => currentStakeholders.includes(stakeholder._id));
  stakeholders.forEach(stakeholder => {
    totalStakeholders = stakeholder.numberOfPeople > 0 ? totalStakeholders + stakeholder.numberOfPeople : totalStakeholders + 1;
  });
  return totalStakeholders || '-';
};

export const getPhase = (phase, company) => {
  return company.activityColumns[phase - 1].toUpperCase();
};

