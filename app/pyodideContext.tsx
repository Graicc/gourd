"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

type PyodideContextType = {
	pyodide: any | null;
	loading: boolean;
	error: Error | null;
};

export const PyodideContext = createContext<PyodideContextType>({
	pyodide: null,
	loading: true,
	error: null,
});

export const PyodideProvider = ({ children }: { children: React.ReactNode }) => {
	const [pyodide, setPyodide] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let mounted = true;
		// Dynamically load the Pyodide script from CDN
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js";
		script.onload = async () => {
			try {
				// @ts-ignore
				const pyodide = await (window as any).loadPyodide();
				if (mounted) {
					setPyodide(pyodide);
					setLoading(false);
				}
			} catch (err: any) {
				setError(err);
				setLoading(false);
			}
		};
		script.onerror = (err: any) => {
			setError(new Error("Failed to load Pyodide script"));
			setLoading(false);
		};
		document.body.appendChild(script);

		return () => {
			mounted = false;
			document.body.removeChild(script);
		};
	}, []);

	return (
		<PyodideContext.Provider value={{ pyodide, loading, error }}>
			{children}
		</PyodideContext.Provider>
	);
};

export const usePyodide = () => useContext(PyodideContext);