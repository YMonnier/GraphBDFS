# GraphBDFS
Graph and Network Theory Project - University Of Lodz - Poland

**GraphBDFS** is a program which allows to **create/view** an **Undirected Connected Graph**. You can create it **randomly** or **personnaly**. Then you can apply the **Breadth First Search** or **Depth First Search** Algorithms on the current Graph. This program was written in JavaScript with 3d.js.

Algorithms
----------

#### Breadth First Search
```
function breadthFirstSearch(Graph G, Vertex V)
Begin
	Q: Queue<Vertex>
	mark visited V
	add V to Q
	While Q is not empty do
	  p = pop(Q)
	  For each n in neighbours(p) do
	    If n is unvisited Then
	      visitedMark(n)
        add n to Q
End
```

#### Depth First Search
```
function depthFirstSearch(Graph G, Vertex V)
Begin
	S: Stack<Vertex>
	mark visited V
	add V to S
	While S is not empty do
	      p = pop(S)
	      If p is unvisited then
	        visitedMark(p)
	        For each n in neighbours(p) do
	          add n to S
End        	    
```
#### Installation
  1. `git clone git@github.com:YMonnier/GraphBDFS.git`
  2. run index.html
  3. enjoy!
  
##Contributors
[@YMonnier](https://github.com/YMonnier)
