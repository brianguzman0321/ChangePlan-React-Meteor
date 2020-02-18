const getNumberOfStakeholders = (allStakeholders, currentStakeholders) => {
  let totalCount = 0;
  let totalAllStakeholders = 0;
  allStakeholders.forEach(stakeholder => {
    if (stakeholder.numberOfPeople > 0) {
      totalAllStakeholders = totalAllStakeholders + stakeholder.numberOfPeople
    } else {
      totalAllStakeholders++
    }
  });
  if (currentStakeholders.length > 0) {
    const selectedStakeholders = allStakeholders.filter(stakeholder => currentStakeholders.includes(stakeholder._id));
    selectedStakeholders.forEach(stakeholder => {
      if (stakeholder.numberOfPeople > 0) {
        totalCount = totalCount + stakeholder.numberOfPeople
      } else {
        totalCount++;
      }
    });
    return `${totalCount} of ${totalAllStakeholders}`
  } else {
    return `0 of ${totalAllStakeholders}`
  }
};

export default getNumberOfStakeholders;