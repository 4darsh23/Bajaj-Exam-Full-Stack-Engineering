const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


const MY_USER_ID   = "AdarshRajDas_16092004";       
const MY_EMAIL     = "ad1082@srmist.edu.in";        
const MY_ROLL_NO   = "RA2311003011645";       


function isValidNode(str) {
  if (typeof str !== "string") return false;
  
  const pattern = /^[A-Z]->[A-Z]$/;
  if (!pattern.test(str)) return false;
  
  const parts = str.split("->");
  if (parts[0] === parts[1]) return false;
  return true;
}

function bfsComponent(start, undirected) {
  const queue = [start];
  const seen = new Set([start]);
  while (queue.length > 0) {
    const cur = queue.shift();
    const neighbors = undirected[cur] || [];
    for (const nb of neighbors) {
      if (!seen.has(nb)) {
        seen.add(nb);
        queue.push(nb);
      }
    }
  }
  return [...seen];
}

function buildNestedTree(root, children) {
  const subtree = {};
  const kids = children[root] || [];
  for (const kid of kids) {
    subtree[kid] = buildNestedTree(kid, children);
  }
  return subtree;
}


function getDepth(root, children) {
  const kids = children[root] || [];
  if (kids.length === 0) return 1;
  let maxChildDepth = 0;
  for (const kid of kids) {
    const d = getDepth(kid, children);
    if (d > maxChildDepth) maxChildDepth = d;
  }
  return 1 + maxChildDepth;
}


app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "request body must have a 'data' array" });
    }

    
    const invalidEntries = [];
    const goodEntries = []; 

    const edgesSeen = new Set();
    const dupEdgesSet = new Set();

    for (let i = 0; i < data.length; i++) {
      const raw = data[i];
      
      const trimmed = typeof raw === "string" ? raw.trim() : "";

      if (!isValidNode(trimmed)) {
        invalidEntries.push(raw); 
        continue;
      }

      const [p, c] = trimmed.split("->");
      const edgeKey = p + "->" + c;

      
      if (edgesSeen.has(edgeKey)) {
        dupEdgesSet.add(edgeKey);
      } else {
        edgesSeen.add(edgeKey);
        goodEntries.push({ parent: p, child: c, raw: edgeKey });
      }
    }

    const childHasParent = {}; 
    const children = {};        
    const allNodes = new Set();

    for (const edge of goodEntries) {
      allNodes.add(edge.parent);
      allNodes.add(edge.child);

      if (childHasParent[edge.child] !== undefined) {
        
        continue;
      }

      childHasParent[edge.child] = edge.parent;
      if (!children[edge.parent]) children[edge.parent] = [];
      children[edge.parent].push(edge.child);
    }

    
    const undirected = {};
    for (const node of allNodes) {
      undirected[node] = [];
    }
    
    for (const node of allNodes) {
      if (childHasParent[node]) {
        const par = childHasParent[node];
        undirected[par].push(node);
        undirected[node].push(par);
      }
    }

    const visited = new Set();
    const components = [];

    for (const node of allNodes) {
      if (!visited.has(node)) {
        const comp = bfsComponent(node, undirected);
        comp.forEach(n => visited.add(n));
        components.push(comp);
      }
    }

   
    const hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let biggestDepth = 0;
    let biggestRoot = null;

    for (const comp of components) {
      
      const roots = comp.filter(n => childHasParent[n] === undefined);

      if (roots.length === 0) {
        
        totalCycles++;
        const sortedComp = [...comp].sort();
        hierarchies.push({
          root: sortedComp[0],
          tree: {},
          has_cycle: true
        });
      } else {
        
        roots.sort();
        const root = roots[0];

        const treeObj = {};
        treeObj[root] = buildNestedTree(root, children);
        const depth = getDepth(root, children);

        totalTrees++;
        const entry = { root: root, tree: treeObj, depth: depth };
        hierarchies.push(entry);

        
        if (depth > biggestDepth || (depth === biggestDepth && (biggestRoot === null || root < biggestRoot))) {
          biggestDepth = depth;
          biggestRoot = root;
        }
      }
    }

    const result = {
      user_id: MY_USER_ID,
      email_id: MY_EMAIL,
      college_roll_number: MY_ROLL_NO,
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: [...dupEdgesSet],
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: biggestRoot || ""
      }
    };

    return res.json(result);

  } catch (err) {
    console.error("something went wrong:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
