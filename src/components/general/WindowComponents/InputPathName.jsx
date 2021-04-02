import "../../../scss/component-inputPathName.scss";

import React, { useState } from "react";
import { correctNameChar, correctPathChar } from "../../../libs/utils";
import { Input } from "../Window";

export default function InputPathName({ path, name, onChange, ...props }) {
	const [pathValue, setPathValue] = useState(path);
	const [nameValue, setNameValue] = useState(name);
	const [prompt, setPrompt] = useState("name");

	const switch2PathPrompt = (e) => {
		e.preventDefault();
		setPrompt("path");
	};
	const switch2NamePrompt = (e) => {
		e.preventDefault();
		setPrompt("name");
	};

	return (
		<div className="component-inputPathName">
			<Input
				className={"hover" + (prompt === "path" ? " full-width" : "")}
				label="Path:"
				type="text"
				name="path-name"
				value={pathValue}
				onChange={(e) => {
					let { value } = e.currentTarget;
					value = correctPathChar(value);

					setPathValue(value);
					if (onChange) onChange({ path: value, name: nameValue });
				}}
				onFocus={switch2PathPrompt}
			/>
			<Input
				className={"hover" + (prompt === "name" ? " full-width" : "")}
				label="Name:"
				type="text"
				name="file-name"
				value={nameValue}
				autoFocus
				onChange={(e) => {
					let { value } = e.currentTarget;
					value = correctNameChar(value);

					setNameValue(value);
					if (onChange) onChange({ path: pathValue, name: value });
				}}
				onFocus={switch2NamePrompt}
			/>
		</div>
	);
}
