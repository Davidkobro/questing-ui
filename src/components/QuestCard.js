import React, { Component} from "react";
import '../App.scss'
import QuestReqItem from './QuestReqItem'

class QuestCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reqKeys : ['CK', 'CK', 'CK']
    };
  }

  async componentWillMount() {

  }

  render() {
    return (
      <div className="questCard">
        <div className="qcardLeft">
          <h4>Reward</h4>
          <h4 id='rwdText'>{this.props.amt} {this.props.rwdName}</h4>
        </div>
        <div className="qcardMiddle">
          <QuestReqItem 
            reqName={'Crypto Kitties'}
            reqKey={'CK'}
          />
        </div>
        <div className="qcardRight">
          <div className="questSubmit">
            <h4 className="whiteText">Submit</h4>
          </div>
          <h4 id="questIdText">questID : {this.props.id}</h4>
        </div>
      </div>
    );
  }
}

export default QuestCard;
