const CHECK_LENGTH = /.{8,}/;
const CHECK_CASE = /(?=.*[A-Z])/;
const CHECK_NUMBER = /.*\d.*/;
const CHECK_SYMBOL = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const passwordValidation = password => {
	const errors = [];

	if (!CHECK_LENGTH.test(password)) {
		errors.push('Password should be at least 8 characters long');
	}

	if (!CHECK_CASE.test(password)) {
		errors.push('Password should have at least one uppercase letter');
	}

	if (!CHECK_NUMBER.test(password)) {
		errors.push('Password should have at least one number');
	}

	if (!CHECK_SYMBOL.test(password)) {
		errors.push(
			'Password should have at least one symbol: example !@#$%^&*'
		);
	}

	return errors;
};
