import { Path } from "../setup";

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

export { unifyPath, pathDestructure, combinePathName };
