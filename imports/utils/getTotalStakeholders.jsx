
const getTotalStakeholders = (allStakeholders, currentStakeholders) => {
  let totalStakeholders = 0;
  let stakeholders = allStakeholders.filter(stakeholder => currentStakeholders.includes(stakeholder._id));
  stakeholders.forEach(stakeholder => {
    if (stakeholder.numberOfPeople > 0) {
      totalStakeholders = totalStakeholders + stakeholder.numberOfPeople
    } else {
      totalStakeholders++
    }
  });
  return totalStakeholders
};

export default getTotalStakeholders;
