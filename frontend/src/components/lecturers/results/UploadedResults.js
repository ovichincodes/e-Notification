import React, { Fragment } from "react";
import { UploadedResultsProvider } from "./UploadedResultsContext";
import Results from "./Results";

const UploadedResults = () => {
	return (
		<Fragment>
			<UploadedResultsProvider>
				<Results />
			</UploadedResultsProvider>
		</Fragment>
	);
};

export default UploadedResults;
