#ifndef SMARTSET_H_
#define SMARTSET_H_

#include <Arduino.h>
#include <LinkedPointerList.h>
#include "SmartItem.h"
//#include "IdManager.h"

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
	static const int MAX_SMARTSETS = 32;
	static const int MAX_SMART_ITEMS = 8;
	
private:
	// constructor
	Smartset(Profile* owner);

	// copy constructor
	Smartset(Smartset* origin);

	// static resources
    //static IdManager idManager;
	
	// static variables
	static int currentId;

	// resources
	LinkedPointerList<SmartItem> smartItems;
	
	// variables
	int id;
	String name;
	Profile* owner;
	bool isCopy;
};

#endif /* SMARTSET_H_ */
