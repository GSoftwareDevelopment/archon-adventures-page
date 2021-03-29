import { Path } from "../setup";

//

function unifyPath(path) {
	if (path.charAt(0) === Path.DELIMITER) path = path.slice(1);
	return path;
}

function pathDestructure(fullPath) {
	const _parts = unifyPath(fullPath).split(Path.DELIMITER);
	const name = _parts.pop();
	const path = Path.DELIMITER + _parts.join(Path.DELIMITER);
	return { path, name };
}

function combinePathName(path, name) {
	let _path = unifyPath(path).split(Path.DELIMITER);
	if (_path[0] === "") _path = [];
	_path.push(name);
	const pathname = Path.DELIMITER + _path.join(Path.DELIMITER);
	return pathname;
}

function getParamsNames(pathname) {
	// get (if exists) parameters name from path
	const regex = /(?=:)(.*?)(?=\/|$)/g;
	let paramsNames = [],
		m;
	while ((m = regex.exec(pathname)) !== null) {
		paramsNames.push(m[0]);
	}
	return paramsNames;
}

function replaceParams(pathname, paramsNames, paramsValues) {
	// replace (if exists) name by value
	paramsNames.forEach((paramName) => {
		const paramValue = paramsValues[paramName.slice(1)];
		if (paramValue) {
			pathname = pathname.replace(paramName, paramValue);
		}
	});
	return pathname;
}
//

function languageCheck(currentLang, defaultLang, availableLangs, callback) {
	availableLangs = [...availableLangs];

	const removeLang = (lang) => {
		const i = availableLangs.indexOf(lang);
		if (i >= 0) {
			availableLangs.splice(i, 1);
			return true;
		}
		return false;
	};

	if (currentLang !== defaultLang) {
		if (removeLang(currentLang) && callback(currentLang)) {
			return currentLang;
		}
	}

	if (removeLang(defaultLang) && callback(defaultLang)) {
		return defaultLang;
	}

	while (availableLangs.length > 0) {
		const lang = availableLangs[0];
		if (removeLang(lang) && callback(lang)) {
			return lang;
		}
	}

	return undefined;
}

function correctNameChar(value) {
	return value.replace(/[^0-9a-zA-Z-_]+/g, "-");
}

function correctPathChar(value) {
	if (value.length === 0) value = Path.DELIMITER;
	value = value.replace("/", Path.DELIMITER);
	return value.replace(/(\\)\1/, "\\").replace(/[^0-9a-zA-Z-:_\\]+/g, "-");
}

function sortFileByCreatedAtAsc(a, b) {
	if (a.createdAt < b.createdAt) return -1;
	else if (a.createdAt > b.createdAt) return 1;
	else return 0;
}
function sortFileByCreatedAtDesc(a, b) {
	if (a.createdAt < b.createdAt) return 1;
	else if (a.createdAt > b.createdAt) return -1;
	else return 0;
}

export {
	unifyPath,
	pathDestructure,
	combinePathName,
	getParamsNames,
	replaceParams,
	languageCheck,
	correctNameChar,
	correctPathChar,
	sortFileByCreatedAtAsc,
	sortFileByCreatedAtDesc,
};
