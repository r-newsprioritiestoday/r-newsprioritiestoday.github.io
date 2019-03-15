import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DateTimePicker } from "material-ui-pickers";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


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
      if (d.datetime.isBetween(date_before, date)){
        console.log('hi')
      }
      return d.datetime.isBetween(date_before, date)
    })
  }

  render() {
    const { selectedDate, data } = this.state
    
    const data_set = this.getDataSet(selectedDate, data)


    return (
      <div style={{width: '50%', margin: '0 auto'}}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Typography variant="h2" gutterBottom>
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
                
                />
            </Grid>
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

                  </Paper>
                </Grid>
              )
            })}
          </Grid>          
        </MuiPickersUtilsProvider>

      </div>
    );
  }
}

export default App;
