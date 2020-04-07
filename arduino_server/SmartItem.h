#ifndef SMART_ITEM_H_
#define SMART_ITEM_H_

#include <WString.h>

// forward declarations
class Item;

class SmartItem
{
public:
	// static constructors
	static SmartItem* create();
	static SmartItem* create(String id, bool active);
	//static SmartItem* createFrom(Item* item);

	// destructor
	virtual ~SmartItem();

	// getters / setters
	//int getTrueId() const;
	String getId() const;
	void setId(String id);
	bool isActive() const;
	void setActive(bool active);
	
protected:
	// constructor
	SmartItem();
	
	// variables
	//int trueId;
	String id;
	bool active;
};

#endif /* SMART_ITEM_H_ */
