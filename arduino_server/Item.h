#ifndef ITEM_H_
#define ITEM_H_

#include <WString.h>
#include <LinkedPointerList.h>
#include "IdManager.h"
#include "Binary.h"
#include "Linear.h"

class Item
{
public:
	// static constructor
	static Item* create();
	
	// destructor
	virtual ~Item();

	// operations
	bool isControlNameAvailable(const String& name);
	bool addControl(Control* control);
	bool removeControl(int index);

	// getters / setters
	Control* getControl(int index);
	Control* getControl(const String& id);
	int getControlIndex(const String& id);
	int getControlsSize();
	
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getIcon() const;
	void setIcon(const String& icon);
	bool isActive() const;
	void setActive(bool active);

	// static constants
	static const int MAX_ITEMS = 64;
	static const int MAX_CONTROLS = 8;
	
private:
	// constructor
	Item();

	// static resources
    static IdManager idManager;

	// resources
	LinkedPointerList<Control> controls;
	
	// variables
	int id;
	String name;
	String icon;
	bool active;
};

#endif /* ITEM_H_ */
