import "./index.css";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { PlayerCardsPage } from "./pages/PlayerCardsPage";
import { PlayerCardsPrintPage } from "./pages/PlayerCardsPrintPage";

render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/playercards" element={<PlayerCardsPage />} />
			<Route path="/playercards/print" element={<PlayerCardsPrintPage />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root")
);