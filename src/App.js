import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DateTimePicker } from "material-ui-pickers";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';


// pick utils
import MomentUtils from '@date-io/moment';
import moment from 'moment'

class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      data: [],
      selectedDate: moment()
    }
  }

  componentDidMount(){

    // get current data and convert datetime to moment object
    fetch('https://raw.githubusercontent.com/r-newsprioritiestoday/newsprioritiestoday-data/master/db.json')
      .then(response => response.json())
      .then(data => { 
        var d = []
        for(var key in data._default){
          if(data._default.hasOwnProperty(key)){
            let date_string = data._default[key].datetime
            let date_object = moment(date_string.replace('{TinyDate}:', ''))
            data._default[key].datetime = date_object
            d.push(data._default[key])
          }
        }
        this.setState({data: d})
      })
      .catch(error => console.log(error))
  }

  // get only the data that was collected at the currently selected date (1 hour before)
  getDataSet(selectedDate, data){
    const date = moment(selectedDate)
    const date_before = moment(selectedDate).subtract(1, 'hour')
    console.log(date, date_before)
    return data.filter((d) => {
      return d.datetime.isBetween(date_before, date)
    })
  }

  fetchTranslations(selected_data){
    for(let i = 0; i < selected_data.length; i++){
      
    }
  }

  // THIS IS WRONG!!!! The data set contains an array of articles. You must access this to replace the translations

  // translate the news that are currently shown
  translateCurrentNews(selectedDate){
    let { data } = this.state
    const selected_data = this.getDataSet(selectedDate, data);
    
    const translated_data = this.fetchTranslations(selected_data)

    // replace all texts with the translated entries
    // first go through all data
    translated_data.forEach(element => {
      // find the index the data is at in the original array
      const index = data.findIndex(item => item.link === element.link)

      // create a new item with all original values and replace the values that have been translated
      let item = {
        ...data[index],
        ["headline"]: element.headline,
        ["text"]: element.text
      }

      // put the new item at the same place the original item was at
      data[index] = item
    });

    // once you are finished, set the state with the new array
    this.setState({
      data
    })
  }

  render() {
    const { selectedDate, data } = this.state
    
    const data_set = this.getDataSet(selectedDate, data)


    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Typography variant="h2" gutterBottom align="center" style={{paddingTop: '1%'}}>
            NEWS PRIORITIES TODAY
          </Typography>
          <Grid container
                direction="column"
                justify="center"
                alignItems="stretch">
            <Grid item xs={12} style={{width: '50%', margin: '0 auto', paddingBottom: '20px'}}>
              <DateTimePicker
                value={selectedDate}
                onChange={(date) => this.setState({selectedDate: date})}
                label="Select News Date"
                showTodayButton
                style={{width: '100%'}}
                
                />
                
            </Grid>
            {/**<Button onClick={this.translateCurrentNews.bind(this)}>Translate Current News</Button>  */}
            <hr/>
            {data_set.map(data => {
              return (
                <Grid item xs={12} >
                  <Paper style={{padding: '20px', margin: '5px'}}>
                    <Typography variant="h4" gutterBottom>
                      {data.country}
                    </Typography>
                    <ul>
                      {data.articles.slice(0,5).map((article) => {
                        return(
                          <li key={article.link}>
                            <Typography variant="body1" gutterBottom>
                              {article.headline + " - " + article.text}
                            </Typography>
                          </li>
                        )
                      })}
                    </ul>
                    <Typography variant="caption" gutterBottom>
                      Source: <Link href={data.source}>{data.source}</Link> @ {moment(data.datetime).format()}
                    </Typography>

                  </Paper>
                </Grid>
              )
            })}
          </Grid>    
          (c)2019, visit {<Link href={"https://www.reddit.com/r/newsprioritiestoday/"}>/r/newsprioritiestoday</Link>} for more information     
        </MuiPickersUtilsProvider>

      </div>
    );
  }
}

export default App;
