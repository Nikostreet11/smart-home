#ifndef SMART_ITEM_H_
#define SMART_ITEM_H_

#include <WString.h>
#include <LinkedPointerList.h>
#include "SmartBinary.h"
#include "SmartLinear.h"

// forward declarations
//class Item;

class SmartItem
{
public:
	// static constructors
	static SmartItem* create();
	static SmartItem* create(String id, bool active);
	static SmartItem* copy(SmartItem* origin);

	// destructor
	virtual ~SmartItem();

	// operations
	void addSmartControl(SmartControl* smartControl);
	bool removeSmartControl(int index);

	// getters / setters
	SmartControl* getSmartControl(int index);
	SmartControl* getSmartControl(const String& id);
	int getSmartControlIndex(const String& id);
	int getSmartControlsSize();
	
	String getId() const;
	void setId(String id);
	bool isActive() const;
	void setActive(bool active);
	
protected:
	// constructor
	SmartItem();
	
	// copy constructor
	SmartItem(SmartItem* origin);

	// resources
	LinkedPointerList<SmartControl> smartControls;
	
	// variables
	String id;
	bool active;
};

#endif /* SMART_ITEM_H_ */
