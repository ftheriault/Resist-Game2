module.exports = AStar = function() {
	this.minObstacleSize = 10;
}

// =========================================
// Author : Frederic Theriault
// URL    : http://www.frederictheriault.com
// -----------------------------------------

/**
 * Calculates a path array using the A* algorithm
 *
 * currentX/Y : current position of sprite
 * destinationYX : destination point
 * this.minObstacleSize : in order to jump to next node, how many pixels can we jump over? 1 is ideal, but requires a lot more processing/memory
 * 
 * returns the path of points to follow
 */ 

AStar.prototype.calculatePath = function(currentX, currentY, destinationX, destinationY, exceptId) {
	var Node = function (x, y, cost, parent) {
		this.x = x;
		this.y = y;
		this.parent = parent; 
		
		this.cost = cost;	// g
		this.h = (Math.abs(this.x - destinationX) + Math.abs(this.y - destinationY)) * 10;	// Heuristic (Manhattan method) cost to reach dest.

		this.score = this.cost + (this.parent != null ? this.parent.score : 0 ) + this.h;
	}

	var path = [];
	var openList = [];
	var closedList = [];
	var resultNode = null;
	var currentNode;
	var x, y;
	var cost = 0;
	var inListNode = null;
	var node = null;

	openList.push(new Node(currentX, currentY, 0, null));

	// while exist not found or there are nodes to visit
	while (openList.length > 0) {
		currentNodeIdx = 0;
		currentNode = openList[currentNodeIdx];
		
		for (var j = 0; j < openList.length; j++) {
			if (currentNode.score > openList[j].score) {
				currentNode = openList[j];
				currentNodeIdx = j;
			}
		}

		openList.splice(currentNodeIdx, 1);
		closedList[currentNode.x + "-" + currentNode.y] = 1;

		// for all adjacent node
		for (var i = 0; i < 8; i++) {
			diagAccepted = true;

			if (i == 0) {x = 0; y = -1 * this.minObstacleSize}
			else if (i == 1) {x = 1 * this.minObstacleSize; y = 0;}
			else if (i == 2) {x = 0; y = 1 * this.minObstacleSize;}
			else if (i == 3) {x = -1 * this.minObstacleSize; y = 0;}
			else if (i == 4) {x = -1 * this.minObstacleSize; y = -1  * this.minObstacleSize;}
			else if (i == 5) {x = 1 * this.minObstacleSize; y = -1  * this.minObstacleSize;}
			else if (i == 6) {x = -1 * this.minObstacleSize; y =  1 * this.minObstacleSize;}
			else if (i == 7) {x = 1 * this.minObstacleSize; y =  1 * this.minObstacleSize;}

			if ((i == 4 && (global.level.getWalkableCost(currentNode.x - 1 * this.minObstacleSize, currentNode.y, exceptId) == -1 || (global.level.getWalkableCost(currentNode.x, currentNode.y - 1 * this.minObstacleSize, exceptId) == -1))) ||
				(i == 5 && (global.level.getWalkableCost(currentNode.x + 1 * this.minObstacleSize, currentNode.y, exceptId) == -1 || (global.level.getWalkableCost(currentNode.x, currentNode.y - 1 * this.minObstacleSize, exceptId) == -1))) ||
				(i == 6 && (global.level.getWalkableCost(currentNode.x - 1 * this.minObstacleSize, currentNode.y, exceptId) == -1 || (global.level.getWalkableCost(currentNode.x, currentNode.y + 1 * this.minObstacleSize, exceptId) == -1))) ||
				(i == 7 && (global.level.getWalkableCost(currentNode.x + 1 * this.minObstacleSize, currentNode.y, exceptId) == -1 || (global.level.getWalkableCost(currentNode.x, currentNode.y + 1 * this.minObstacleSize, exceptId) == -1)))) {
				diagAccepted = false;
			} 

			// if the node isn't an objstacle or part of closed list
			cost = global.level.getWalkableCost(currentNode.x + x, currentNode.y + y, exceptId);
			if (cost != -1 && diagAccepted &&
				closedList[(currentNode.x + x) + "-" + (currentNode.y + y)] == null) {
				node = new Node(currentNode.x + x, currentNode.y + y, cost + (i > 3 ? 4 : 0), currentNode);	
				inListNode = null;

				for (var j = 0; j < openList.length; j++) {
					if (openList[j].x == node.x && openList[j].y == node.y) {
						inListNode = openList[j];
						break;
					}
				}

				if (inListNode == null) {
					openList.push(node);
				}
				else {
					if (node.score < inListNode.score) {
						inListNode = node;
					}
				}

				// check if node is target node. If so, done!
				if (Math.abs(node.x - destinationX) <  this.minObstacleSize && 
					Math.abs(node.y - destinationY) <  this.minObstacleSize) {
					resultNode = node;
					break;
				}
			}	
		}

		if (resultNode != null) {
			break;
		}
	}

	// If the resultNod exists, backtrack and create a path
	if (resultNode != null) {
		var direction;
		path.unshift(resultNode);

		while (resultNode.parent != null) {
			resultNode = resultNode.parent;
			path.unshift(resultNode);
		}
	}

	for (var i = 0; i < path.length; i++) {
		path[i].parent = null;
		path[i].cost = null;
		path[i].h = null;
		path[i].score = null;
	};

	return path;
}
