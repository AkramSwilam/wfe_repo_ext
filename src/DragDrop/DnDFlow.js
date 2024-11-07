import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Edge,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar, { nodeTypes } from './sidebar';

import './style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
const [wfName, setWfName] = useState('')

// useEffect(()=>{

// },[wfName])
  //background
  const [variant, setVariant] = useState('Lines');

  //update Node 
  const [editValue, setEditValue] = useState(nodes.data)
  const [id, setId] = useState()

  //edit function
  const onNodeClick = (e, val) => {
    setEditValue(val.data.label)
    setId(val.id)
  }

  const onNodeDoubleClick = (event, node) => {
    event.stopPropagation();
    setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
  };

  //handle Change
  const handleChange=(e)=>{
      e.preventDefault();
    setWfName( e.target.value);
  }
  //handle Function
  const handleESave =()=>{
    console.log('workflow saved ', wfName , ':/n ',nodes, ' / ', edges);
    
    // const res=nodes.map((item)=>{
    //   if(item.id===id){
    //     item.data={
    //       ...item.data,
    //       label:editValue
    //     }
    //   }
    //   return item
    // })
    // setNodes(res)
    // setEditValue('')
  }

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const [nodeId, setNodeId] = useState(1);
  const onEdgeClick = (event, edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="dndflow">
      <div className="updatenode__controls">

        <label>Workflow Name:</label><br />
        <input type="text" onChange={handleChange} /> <br />
        <button onClick={handleESave} className="btn">Save</button>
      </div>

      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
          
            nodes={nodes}
            edges={edges}
            onNodeClick={(e, val) => onNodeClick(e, val)}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onEdgeClick={onEdgeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={nodeTypes}
            fitView
          >
              <Background color="#99b3ec" variant={variant} />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar setNodes={setNodes} setNodeId={setNodeId} />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;