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
  const phaseName = company.activityColumns[phase - 1];
  return phaseName[0].toUpperCase() + phaseName.slice(1).toLowerCase();
};

export const calculationLevels = (type, currentImpacts, isMatrix = false) => {
  let level = '';
  if (currentImpacts.length > 1) {
    const highImpacts = currentImpacts.filter(currentImpact => currentImpact.level.toUpperCase() === 'HIGH');
    const mediumImpacts = currentImpacts.filter(currentImpact => currentImpact.level.toUpperCase() === 'MEDIUM');
    const lowImpacts = currentImpacts.filter(currentImpact => currentImpact.level.toUpperCase() === 'LOW');
    if (highImpacts.length > 0) {
      level = isMatrix ? 5 : 'H';
    } else if (mediumImpacts.length > 0) {
      level = isMatrix ? 3 : 'M';
    } else if (lowImpacts.length > 0) {
      level = isMatrix ? 1 : 'L';
    }
  } else if (currentImpacts.length === 1) {
    level = currentImpacts[0].level.toUpperCase().slice(0, 1)
    if (isMatrix) {
      level = currentImpacts[0].level === 'High' ? 5 : currentImpacts[0].level === 'Medium' ? 3 : currentImpacts[0].level === 'Low' ? 1 : null;
    }
  }
  if (type !== 'stakeholders') {
    return {type: type, level: level}
  } else {
    return level;
  }
};

export const ChangeManagersNames = (project) => {
  if (project.changeManagerDetails) {
    let changeManagers = project.changeManagerDetails.map(changeManager => {
      return `${changeManager.profile.firstName} ${changeManager.profile.lastName}`
    });
    if (changeManagers.length) {
      return changeManagers.join(", ")
    } else {
      return "-"
    }
  }
};

