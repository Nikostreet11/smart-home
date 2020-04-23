#ifndef ROOM_H_
#define ROOM_H_

#include <LinkedPointerList.h> // linked list library
#include "Item.h"
#include "Smartset.h"
#include "IdManager.h"

class Room
{
public:
	// static constructors
	static Room* create();
	
	// destructor
	virtual ~Room();

	// operations
	bool addItem(Item* item);
	bool addSmartset(Smartset* smartset);
	bool removeItem(int index);
	bool removeSmartset(int index);

	// getters / setters
	Item* getItem(int index);
	Smartset* getSmartset(int index);
	Item* getItem(const String& id);
	Smartset* getSmartset(const String& id);
	int getItemIndex(const String& id);
	int getSmartsetIndex(const String& id);
	int getItemsSize();
	int getSmartsetsSize();

	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getIcon() const;
	void setIcon(const String& icon);

	// static constants
	static const int MAX_ROOMS = 32;
	static const int MAX_ITEMS = 32;
	
private:
	// constructors
	Room();

	// static resources
    static IdManager idManager;

	// resources
	LinkedPointerList<Item> items;
	LinkedPointerList<Smartset> smartsets;
	
	// variables
	int id;
	String name;
	String icon;
};

#endif /* ROOM_H_ */
