import path from 'path';
import * as fs from '../../../shared/lib/fs.js';
import * as stringify from './stringify.js';
import reporter from '../../../shared/lib/error-reporter.js';

const writeData = async ({ locations, featureCollection, report, options, sourceRatings, multivalentLocations }) => {
  let suffix = '';
  if (options.outputSuffix !== undefined) {
    suffix = options.outputSuffix;
  } else if (process.env.SCRAPE_DATE) {
    suffix = `-${process.env.SCRAPE_DATE}`;
  }

  await fs.writeFile(path.join('dist', `data${suffix}.json`), JSON.stringify(locations, null, 2));

  await fs.writeFile(
    path.join('dist', `data-multivalent${suffix}.json`),
    JSON.stringify(multivalentLocations, null, 2)
  );

  await fs.writeCSV(path.join('dist', `data${suffix}.csv`), stringify.csvForDay(locations));

  await fs.writeJSON(path.join('dist', `features${suffix}.json`), featureCollection, { space: 0 });

  await fs.writeJSON('dist/report.json', report, { space: 2 });

  await fs.writeJSON('dist/ratings.json', sourceRatings, { space: 2 });

  await fs.writeCSV('dist/reports/crawler-report.csv', reporter.getCSV());

  return { locations, featureCollection, report, options };
};

export default writeData;
