"use strict";

import React from "react";
import PropTypes from "prop-types";

import {
  View,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import PickerCategory from "./PickerCategory";
import styles from "./style";
import BaseComponent from "./BaseComponent";
import LinearGradient from "react-native-linear-gradient";
import IconF from "react-native-vector-icons/Feather";
import IconAD from "react-native-vector-icons/AntDesign";
import moment from "moment";

const { width } = Dimensions.get("window");

const propTypes = {
  data: PropTypes.array,
  onChange: PropTypes.func,
  initValue: PropTypes.array,
  label: PropTypes.array,
  height: PropTypes.number,
  gradientStyle: PropTypes.object
};

const defaultProps = {
  data: [],
  onChange: () => {},
  initValue: [],
  style: {},
  selectStyle: {},
  cancelStyle: {},
  label: [],
  height: 1,
  gradientStyle: {
    start: { x: 0.0, y: 0 },
    end: { x: 1, y: 1.0 },
    locations: [0, 1],
    colors: ["#743e4e", "#221d33"]
  }
};

export default class ModalPicker extends BaseComponent {
  constructor(props) {
    super(props);

    this._bind("onChange", "open", "close", "renderChildren", "accept");
    this.state = {
      animationType: "fade",
      modalVisible: false,
      transparent: false,
      selected: "please select",
      selection: new Array(this.props.data.length)
    };
  }

  componentDidMount() {
    this.setState({ selection: this.props.initValue });
  }

  onChange = (item, catId) => {
    const selection = this.state.selection;
    selection[catId] = item;

    if (catId === 2) {
      let oo = moment().year();
      if (selection[2] !== undefined) {
        oo = selection[2];
      }

      let kk = oo + "-" + 2 + "-01";
      kk = moment(kk);
    }
    if (catId === 1) {
      let kk = selection[2] || moment().year() + "-" + selection[1] + "-01";
      kk = moment(kk);
    }

    this.setState(selection);
  };

  close() {
    if (this.props.initValue) {
      const initValue = this.props.initValue;
      this.setState({ selection: initValue });
    }

    this.setState({
      modalVisible: false
    });
  }

  accept() {
    const { selection } = this.state;
    this.props.onChange(selection);

    this.setState({
      modalVisible: false
    });
  }

  open() {
    this.setState({
      modalVisible: true
    });
  }

  renderChildren() {
    if (this.props.children) {
      return this.props.children;
    }
    return <Text>Please Select an Item!</Text>;
  }

  renderOptionList(catItem, catId, catNum) {
    let borderLeft = catId === 0 ? 0 : 20;
    let borderRight = catId === catNum - 1 ? 0 : 20;

    return (
      <View
        key={catId}
        style={{
          width: (width * 1) / this.props.data.length
        }}
      >
        {this.props.label[catId].length > 0 ? (
          <View
            style={{
              paddingVertical: 8,
              width: "100%",
              alignItems: "center",
              backgroundColor: "#ffffff05",
              borderBottomRightRadius: borderRight,
              borderBottomLeftRadius: borderLeft,
              marginBottom: 2,
              elevation: 1
            }}
          >
            <Text
              style={{
                color: "#f9976c",
                fontSize: 20,
                fontFamily: "Montserrat"
              }}
            >
              {this.props.label[catId]}
            </Text>
          </View>
        ) : (
          <View style={{ height: "8%" }}></View>
        )}
        <PickerCategory
          key={catId}
          initValue={this.props.initValue}
          catId={catId}
          catNum={catNum}
          data={catItem}
          onPress={this.onChange}
        />
      </View>
    );
  }

  showDays() {
    const year = this.state.selection[2] || moment().year();
    const month = this.state.selection[1] || moment().month();
    const countDayes = moment(year + "-" + month).daysInMonth();
    const days = new Array(countDayes).fill({ label: null }).map((item, id) => {
      const option = id + 1;
      return {
        label: option,
        key: option
      };
    });
    return days;
  }

  renderCategory() {
    const catNum = this.props.data.length;
    let catId = -1;
    let catShow = this.props.data.map(catItem => {
      catId++;
      if (catId === 0 && catNum === 3 && this.props.data[0].length === 0) {
        catItem = this.showDays();
      }
      return this.renderOptionList(catItem, catId, catNum);
    });

    let pickerHeight = 88;
    let propsHeight = this.props.height;

    if (propsHeight * 1) {
      propsHeight = propsHeight < 0 ? 0 : propsHeight;
      propsHeight = propsHeight > 1 ? 1 : propsHeight;

      pickerHeight = 88 * propsHeight;
    }
    return (
      <View style={{ flex: 1, height: "100%", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: pickerHeight + "%"
          }}
        >
          {catShow}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={this.close}>
            <View style={styles.cancelStyle}>
              <IconAD name="close" size={25} color="#999999" />
            </View>
          </TouchableOpacity>

          <Text
            style={[
              {
                width: "60%",
                color: "#666666",
                justifyContent: "center",
                alignSelf: "center",
                textAlign: "center",
                fontSize: 13,
                fontFamily: "Comfortaa",
                textTransform: "uppercase"
              },
              this.props.bottomLabel.style
            ]}
          >
            {this.props.bottomLabel.text || ""}
          </Text>

          <TouchableOpacity onPress={this.accept}>
            <View style={styles.acceptStyle}>
              <IconF name="check" size={30} color="#27AEE7" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const dp = (
      <Modal
        transparent={true}
        ref="modal"
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}
      >
        <TouchableWithoutFeedback onPress={this.close}>
          <LinearGradient
            start={this.props.gradientStyle.start}
            end={this.props.gradientStyle.end}
            locations={this.props.gradientStyle.locations}
            colors={this.props.gradientStyle.colors}
            style={{
              height: "100%",
              width: "100%"
            }}
          >
            {this.renderCategory()}
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Modal>
    );

    console.log("new");
    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
