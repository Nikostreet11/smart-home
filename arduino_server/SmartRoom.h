#ifndef SMART_ROOM_H_
#define SMART_ROOM_H_

#include <Arduino.h>
#include <LinkedPointerList.h>
#include "Smartset.h"

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
	bool addSmartset(Smartset* smartset);
	bool removeSmartset(int index);

	// getters / setters
	const String& getId() const;
	void setId(const String& id);
	Smartset* getSmartset(int index);
	Smartset* getSmartset(const String& id);
	Smartset* getSmartsetByName(const String& name);
	int getSmartsetIndex(const String& id);
	int getSmartsetsSize();

	// static constants
	static const int MAX_SMARTSETS = 16;
	
protected:
	// constructors
	SmartRoom();

private:
	// resources
	LinkedPointerList<Smartset> smartsets;
	
	// variables
	String id;
};

#endif /* SMART_ROOM_H_ */
