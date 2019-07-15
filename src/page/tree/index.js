import React, { Component } from 'react';
import { Tree, Row, Col, Form, Tooltip, Icon, Input, Button, Modal, message } from 'antd';
import { connect } from 'dva';

const { TreeNode } = Tree;

const namespace = 'trees';

const mapStateToProps = (state) => {
  const treesList = state[namespace].treesList;
  return {
    treesList,
  };
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.myTree = React.createRef();
  }
  state={
    selected:{},
    selectedParent:null,
    addVisible: false,
    newAttr:{},
    addNodeVisible: false,
    newNodeName:"",
    newNodeId:100000,
  };

  componentDidMount() {
    console.log("mount")
    //this.props.onDidMount();
    this.props.dispatch({
      type: `${namespace}/queryList`,
    });
    //console.log("treesList:"+this.props.treesList)
  };
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selectTree(selectedKeys[0], this.props.treesList, null);
    //let selected=this.state.selected;
    //console.log(selected);
    
  };
  selectTree = (key, data, parent) => {
    let isFind=false;
    for(let i=0;i<data.length;i++){
      if(key == data[i].id){
        isFind=true;
        //this.state.selected=data[i];
        this.setState({
          selected: data[i],
          selectedParent: parent
        }, () => this.updateForm());
        break;
      }
    }
    if(! isFind){
      for(let i=0;i<data.length;i++){
        if(data[i].children){
          this.selectTree(key, data[i].children, data[i]);
        }
      }
    }
  };
  updateForm(){
    this.props.form.setFieldsValue({name:this.state.selected.name});
    this.props.form.setFieldsValue({text:this.state.selected.text});
  };
  renderTree = (data) =>{
    console.log('树形菜单数据源', data);
    return data.map(item => {
      if (!item.children) {
        return (
          <TreeNode title={item.name} key={item.id} />
        )
      } else {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTree(item.children)}
          </TreeNode>
        )
      }
    })
  };
  renderAttrs = (data) =>{
    console.log(data)
    if(data){
      //let r=[data.length];
      let i=-1;
      var r = new Array()
      Object.keys(data).forEach(k => {
        i++;
        r[i]=
        <Form.Item label={k} key={'item'+i}>
          <Input value={data[k]} />
          <Button shape="circle" icon="close" size="small" onClick={ (e)=>{ this.removeAttr(k) } } />
          {/* <Icon type="close" onClick={this.removeAttr(k)} /> */}
        </Form.Item>
      });
      return r;
    }else{
      return "";
    }
  };
  removeAttr = (k) => {
    let selected=this.state.selected;
    delete selected.attrs[k];
    this.setState({
      selected: selected,
    });
  };
  showModal = () => {
    this.setState({
      addVisible: true,
    });
  };
  handleOk = e => {
    console.log(e);
    if(this.state.newAttr.key && this.state.newAttr.value){
      let selected=this.state.selected;
      let newAttr=this.state.newAttr;
      if(! selected.attrs){
        selected.attrs={};
      }
      selected.attrs[newAttr.key]=newAttr.value;
      this.setState({
        selected: selected,
      });
    }
    this.setState({
      addVisible: false,
      newAttr: {}
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      addVisible: false,
    });
  };
  newAttrKeyChange = e => {
    console.log(e.target.value);
    //this.state.newAttr.key=e.target.value;
    let newAttr=this.state.newAttr;
    newAttr.key=e.target.value;
    this.setState({
      newAttr : newAttr
    });
  };
  newAttrValueChange = e => {
    //this.state.newAttr.value=e.target.value;
    let newAttr=this.state.newAttr;
    newAttr.value=e.target.value;
    this.setState({
      newAttr : newAttr
    });
  };
  nameChange = e => {
    let selected=this.state.selected;
    selected.name=e.target.value;
    this.setState({
      selected : selected
    });
  };
  textChange = e => {
    let selected=this.state.selected;
    selected.text=e.target.value;
    this.setState({
      selected : selected
    });
  };
  submitTree = () => {
    //this.props.submitTree(this.props.treesList);
    //const { dispatch } = this.props;
    console.log("submitTree")
    this.props.dispatch({
        type: 'trees/updateTree',
        payload: this.props.treesList[0]
      });
      //console.log(res);
  };
  showAddNode = e => {
    if(this.state.selected && this.state.selected.id){
      this.setState({
        addNodeVisible: true,
      });
    }else{
      message.warning('请先选中节点');
    }
    
  };
  handleAddNodeOk = e => {
    if(this.state.newNodeName){
      let newNodeId=this.state.newNodeId;
      newNodeId++;
      let newNode={id: newNodeId, name: this.state.newNodeName};
      let selected=this.state.selected
      if(! selected.children){
        selected.children=[];
      }
      selected.children.push(newNode);
      this.setState({
        //selected: newNode,
        newNodeId: newNodeId
      });

    }
    this.setState({
      addNodeVisible: false,
    });
  };

  handleAddNodeCancel = e => {
    console.log(e);
    this.setState({
      addNodeVisible: false,
    });
  };
  newNodeNameChange = e => {
    console.log(e.target.value);
    this.setState({
      newNodeName: e.target.value,
    });
  };
  deleteNode = e => {
    let selected=this.state.selected;
    if(! selected || ! selected.id){
      message.warning('请先选中节点');
      return;
    }

    if(selected.children && selected.children.length > 0){
      message.warn("存在子节点，不能删除")
    }else if(this.state.selectedParent == null){
      message.warn("根节点不能删除")
    }else{
      let index = this.state.selectedParent.children.indexOf(selected);
      if (index > -1) {
        this.state.selectedParent.children.splice(index, 1);
        this.setState({
          selected: {},
        });
      }
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div>
        <Row>
          <Col span={9}>
            <Button htmlType="button" onClick={ this.showAddNode } >
              添加
            </Button>
            <Button htmlType="button" style={{ marginLeft: 8 }} onClick={ this.deleteNode } >
              删除
            </Button>
          <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect} ref={this.myTree}>
            {
              this.renderTree(this.props.treesList)
            }
          </Tree>
            <Button htmlType="button" onClick={ this.submitTree } >
              提交
            </Button>
          </Col>
          <Col span={15}>
            <Form {...formItemLayout} hidden={ ! this.state.selected.id}>
              <Form.Item label="Name">
              {getFieldDecorator('name')(<Input onChange={this.nameChange} />)}
              </Form.Item>
              <Form.Item label="Text">
              {getFieldDecorator('text')(<Input onChange={this.textChange} />)}
              </Form.Item>
              {this.renderAttrs(this.state.selected.attrs)}
              <Form.Item {...tailFormItemLayout}>
                {/* <Button type="primary" htmlType="submit">
                  Register
                </Button> */}
                <Button style={{ marginLeft: 8 }} htmlType="button" onClick={this.showModal}>
                  Add attr
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Modal
          title="添加属性"
          visible={this.state.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <span>属性名</span>
            <Input value={this.state.newAttr.key} onChange={this.newAttrKeyChange} />
          </div>
          <div>
          <span>属性值</span>
            <Input value={this.state.newAttr.value} onChange={this.newAttrValueChange} />
          </div>
        </Modal>
        <Modal
          title="添加节点"
          visible={this.state.addNodeVisible}
          onOk={this.handleAddNodeOk}
          onCancel={this.handleAddNodeCancel}
        >
          <div>
            <span>节点名称</span>
            <Input value={this.state.newNodeName} onChange={this.newNodeNameChange} />
          </div>
        </Modal>
      </div>
      
    );
  }
}

//const WrappedRegistrationForm = Form.create({ name: 'register' })(Demo);

//export default connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm);
export default connect(mapStateToProps)(Form.create()(Demo));

