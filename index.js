const express = require("express");
const axios = require("axios");
const { compareValues } = require("./utils");
const app = express();
const port = 3000;

app.use(express.json());

const FILLOUT_API_URL = "https://api.fillout.com/v1/api/forms";
const API_KEY =
  "sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912";

const demo_form_id = "cLZojxk94ous";

app.get("/:formId/filteredResponses", async (req, res) => {
  const formId = req.params.formId;
  const query = req.query;
  let queryString = "";

  try {
    if (query) {
      queryString = Object.keys(query)
        .filter((key) => key !== "filters")
        .map((key) => `${key}:${query[key]}`)
        .join("$");
    }
    let response = await axios.get(
      `${FILLOUT_API_URL}/${formId}/submissions?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    let filteredResponses = response.data.responses;

    if (query?.filters) {
      let filters = JSON.parse(query.filters);
      if (filteredResponses.length > 0) {
        filters = filters.map((item) => {
          let { id, condition, value } = item;
          let index = filteredResponses[0].questions.findIndex(
            (item) => item.id === id
          );
          if (index > -1) {
            return { id, condition, value, index };
          } else {
            return { id, condition, value };
          }
        });
      }
      filters.forEach(filter => {
        let { condition, value, index } = filter;
        if (filter.index !== undefined) {
          filteredResponses = filteredResponses.filter(item => {
            let itemValue = item.questions[index].value;
            return compareValues(typeof(itemValue), condition, itemValue, value);
          })
        }
      });
    }

    res.status(200).json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: response.data.pageCount,
    });
  } catch (error) {
    console.error(`Error while fetching: ${error}`);
    res.status(400).json({ error: "Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
