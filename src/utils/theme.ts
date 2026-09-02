export const formatIndianCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const getDaysAgoText = (isoString: string): { text: string; isStale: boolean } => {
  const diffTime = Math.abs(Date.now() - new Date(isoString).getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return { text: 'Updated today', isStale: false };
  if (diffDays === 1) return { text: 'Updated yesterday', isStale: false };
  if (diffDays <= 30) return { text: `Updated ${diffDays} days ago`, isStale: false };
  
  return { text: `Updated ${diffDays} days ago`, isStale: true };
};

export interface CooldownStatus {
  canEdit: boolean;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  formattedRemaining: string;
  lastEditedText: string;
}

export const get24HourEditStatus = (lastEditedAt?: string): CooldownStatus => {
  if (!lastEditedAt) {
    return {
      canEdit: true,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      formattedRemaining: '',
      lastEditedText: 'Never modified'
    };
  }

  const editTime = new Date(lastEditedAt).getTime();
  if (isNaN(editTime)) {
    return {
      canEdit: true,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      formattedRemaining: '',
      lastEditedText: 'Never modified'
    };
  }

  const cooldownMs = 24 * 60 * 60 * 1000;
  const elapsedMs = Date.now() - editTime;
  const diffMs = cooldownMs - elapsedMs;

  const dateObj = new Date(editTime);
  const timeFormatted = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const lastEditedText = `${dateFormatted}, ${timeFormatted}`;

  if (diffMs <= 0) {
    return {
      canEdit: true,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      formattedRemaining: '',
      lastEditedText
    };
  }

  const hoursRemaining = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  let formattedRemaining = '';
  if (hoursRemaining > 0) {
    formattedRemaining = `${hoursRemaining}h ${minutesRemaining}m`;
  } else if (minutesRemaining > 0) {
    formattedRemaining = `${minutesRemaining}m`;
  } else {
    formattedRemaining = `${secondsRemaining}s`;
  }

  return {
    canEdit: false,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    formattedRemaining,
    lastEditedText
  };
};

