export const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateOTP = (): number => {
	return Math.floor(1000 + Math.random() * 9000);
};
