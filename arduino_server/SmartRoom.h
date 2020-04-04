#ifndef SMART_ROOM_H_
#define SMART_ROOM_H_

#include <Arduino.h>
#include <LinkedPointerList.h>
#include "SmartItem.h"

// forward declarations
class Room;

class SmartRoom
{
public:
	// static constructor
	static SmartRoom* create(String id);

	// destructor
	virtual ~SmartRoom();

	// operations
	bool add(SmartItem* smartItem);
	bool remove(int index);

	// update
	//void updateFrom(Room* room);

	// getters / setters
	const String& getId() const;
	void setId(const String& id);
	SmartItem* get(int index);
	SmartItem* get(const String& id);
	int getIndex(const String& id);
	int getSize();

	// static constants
	//static const int MAX_ITEMS = 8;
	
protected:
	// constructors
	SmartRoom();

private:
	// resources
	LinkedPointerList<SmartItem> smartItems;
	
	// variables
	String id;
};

#endif /* SMART_ROOM_H_ */
