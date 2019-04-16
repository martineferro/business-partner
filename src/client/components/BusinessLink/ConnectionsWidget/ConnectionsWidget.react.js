import React, { PropTypes, Component } from 'react';
import { Line, LineChart, XAxis, YAxis, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BusinessLink } from '../../../api';
import locales from '../../../i18n';
import dateHelper from '../../../utils/dateHelper';
import BusinessLinkModel from '../../../models/BusinessLink';
const STATUS = BusinessLinkModel.STATUS;

export default class ConnectSupplierWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { businessLinks: [] };
    this.businessLinkApi = new BusinessLink();
  }

   static contextTypes = {
    i18n : PropTypes.object.isRequired
  };

  static propTypes = {
    customerId: PropTypes.string.isRequired
  };

  componentWillMount() {
    this.context.i18n.register('BusinessLink', locales);
  }

  componentDidMount() {
    const query = { connectionStatus: STATUS.CONNECTED };
    this.businessLinkApi.allForCustomerId(this.props.customerId, query).
      then(businessLinks => this.setState({ businessLinks: businessLinks }));
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('BusinessLink', locales);
  }

  getData() {
    if (this.state.businessLinks.length === 0) return [];

    let dataByDate = {};

    for (const bl of this.state.businessLinks) {
      const date = new Date(new Date(bl.createdOn).setHours(0,0,0,0));

      if (!dataByDate[date]) dataByDate[date] = 0;

      dataByDate[date] += 1;
    }

    return Object.keys(dataByDate).sort(dateHelper.sort).
      map(date => {
        const translatedDate = new Date(date).toLocaleDateString(this.context.i18n.locale || 'en');
        return { date: translatedDate, 'supplier count': dataByDate[date] }
      });
  }

  render()
  {
    const i18n = this.context.i18n;

    return (
      <ResponsiveContainer width={"100%"} height={300} debounce={50}>
        <LineChart
          data={this.getData()}
          margin={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <Legend />
          <XAxis dataKey="date" padding={{left: 20, right: 20}} />
          <YAxis padding={{top: 20, bottom: 20}}/>
          <Line
            type="stepAfter"
            dataKey='supplier count'
            name={i18n.getMessage('BusinessLink.Widget.connectedSuppliers')}
            stroke="#5E9CD3"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }
};

let dateSort = function(a, b) {
  return new Date(a) - new Date(b);
}
