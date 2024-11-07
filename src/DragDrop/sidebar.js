import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Handle } from "reactflow";
import {Form} from 'react-bootstrap';

// eslint-disable-next-line import/no-anonymous-default-export


// NodeWithSelect function which handle on node click "Emails, HTTP request and webhooks" on sidebar buttons what will be created in right page
export const NodeWithSelect = ({ data }) => {
  const handleChange = (event) => {
    data.onChange(event.target.value);
  };
  console.log('NodeWithSelect 0 : ', data);

  return (
    <div>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <Form.Group key='data-target' className="mb-3" controlId={`exampleForm.ControlInput`}>
          <Form.Label>Data:</Form.Label>
          <Form.Control type='text' name='data-target' placeholder='Data' onChange={handleChange} required='' />
      </Form.Group>
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
};

// ApprovalWithSelect function which handle on group click "Approvals" on sidebar buttons what will be created in right page
export const ApprovalWithSelect = ({ data }) => {
  const handleChange = (event) => {
    data.onChange(event.target.value);
  };
  console.log('NodeWithSelect 1 : ', data);

  return (
    <div>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <select onChange={handleChange}>
        {data.options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
};

// FormWithSelect function which handle on group click "Forms" on sidebar buttons what will be created in right page
// Handle type target parameter, responsible for node input edges
// Handle type source parameter, responsible for node output edges
export const FormWithSelect = ({ data }) => {
  const handleChange = (event) => {
    data.onChange(event.target.value);
  };
  console.log('NodeWithSelect 1 : ', data);

  return (
    <div>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      {/* <select onChange={handleChange}> */}
          {data.options.value}
      
      {/* </select> */}
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
};

// EndNode is responsible for the final node at end of page, with type target for only inputs
export const EndNode = ({ data }) => (
  <div style={{ border: '1px solid #777', padding: 10, borderRadius: 5, background: '#fff', position: 'relative' }}>
    <Handle type="target" position="top" style={{ background: '#555' }} />
    {data.label}
  </div>
);

// Setting here all nodes types, including endNode
export const nodeTypes = {
  selectNode: NodeWithSelect,
  selectForm2: FormWithSelect,
  output: EndNode,
};

const Sidebar = ({ setNodes, setNodeId, EndNode, setNodeContent }) => {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  function onAddGroup(stageId, subForms) {
    const groupId = `group-${stageId}`;
    var newNodes = [];

    newNodes = [
      ...newNodes,
      {
        id: groupId,
        type: 'group',
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: { label: `Group ${stageId}` },
        style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#212529', width: 140, height: (subForms.length * 100) + 'px' , zIndex: -1 },
      }]

      let xAxis = 0;
      subForms.map(record => (
        xAxis += 2,
        newNodes = [
          ...newNodes,
          {
              id: `${stageId + '' + record.id}`,
              type: 'selectForm2',
              position: { x: xAxis, y: 40 * xAxis },
              data: { label: `Node ${stageId + '' + record.id}`, onChange: handleNodeChange, options: { value: record.name, label: record.name +' / ' + record.id } },
              parentId: groupId,
              extent: 'parent',
              style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#fff' },
            }]
          
    ))

    console.log('All node : ', newNodes)

    setNodes((nds) => nds.concat(newNodes));
    setNodeId((id) => id + 3);
  };

  const handleNodeChange = (value) => {
    console.log('Selected value:', value);
  };
  // Handling adding node section
  // Setting inside node, node type, setting nodes ID
  // Relating selectNode for node types with their node content even it's label text, drop down, text field, etc...
  function onAddNode(record) {
    const newNode = {
      id: `${record}`,
      type: 'selectNode',
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: { label: `Node ${record}`, onChange: handleNodeChange, options: [{ value: 'option1', label: 'Option 1' + record.id }, { value: 'option2', label: 'Option 2' }]  },
      style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#fff' },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
};
  
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("http://localhost:6002/api/stages/type-stages",{
          headers:{
            authorization:`
            Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwOTgzNDA2LCJleHAiOjE3MzEwNjk4MDZ9.8h1VsRXf2entqubxV0Ne5Mko5xIb-nen_4K6zOCjxp0
            `
          }
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => console.log(err));
    };
    fetchData();
  }, []);

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      {data
        ? data.map((stage) => (
            <div>
              <div style={{height:'1px',width:'80%',backgroundColor:'black'}}></div>
              <div
                className="dndnode custom"
                onDragStart={(event) => onDragStart(event, stage.type)}
                onClick={()=>{onAddNode(stage.id)}}
                draggable
              >
                {stage["type"]}
              </div>
              {stage["type"] === "Form"
                ? stage["Stages"].map((form) => (
                    <div
                    onClick={() => onAddGroup(form.id, form.SubForms)}
                      className="dndnode custom"
                      onDragStart={(event) =>
                        onDragStart(event, form.name + " / " + form.id)
                      }
                      draggable
                    >
                      {form.name + " / " + form.id}
                    </div>
                  ))
                : ""}
            </div>
          ))
        : ""}

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>
     
    </aside>
  );
};

export default Sidebar;
