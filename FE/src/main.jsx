import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { persistStore } from "redux-persist";
import store from "@/redux/storeConfig";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "@/lib/axios";
import { Toaster } from "./components/ui/sonner";

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Toaster
			position="bottom-right"
			richColors
			toastOptions={{
				classNames: {
					error: "bg--100 text-red-800 border border-red-300 shadow-xl",
					success:
						"bg-green-100 text-green-800 border border-green-300 shadow-xl",
					loading: "bg-blue-100 text-blue-800 border border-blue-300 shadow-xl",
				},
			}}
		/>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</StrictMode>,
);
