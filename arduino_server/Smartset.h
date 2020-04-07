#ifndef SMARTSET_H_
#define SMARTSET_H_

#include <Arduino.h>
#include <LinkedPointerList.h>
#include "SmartItem.h"

// forward declarations
class Profile;

class Smartset
{
public:
	// static constructor
	static Smartset* create(Profile* owner);
	static Smartset* copy(Smartset* origin);

	// destructor
	virtual ~Smartset();

	// operations
	bool addSmartItem(SmartItem* smartItem);
	bool removeSmartItem(int index);

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	Profile* getOwner();
	SmartItem* getSmartItem(int index);
	SmartItem* getSmartItem(const String& id);
	int getSmartItemIndex(const String& id);
	int getSmartItemsSize();

	// static constants
	static const int MAX_SMARTSETS = 1024;
	static const int MAX_SMART_ITEMS = 8;
	
private:
	// constructor
	Smartset(Profile* owner);

	// copy constructor
	Smartset(Smartset* origin);
	
	// static variables
	static int currentId;

	// resources
	LinkedPointerList<SmartItem> smartItems;
	
	// variables
	int id;
	String name;
	Profile* owner;
};

#endif /* SMARTSET_H_ */
