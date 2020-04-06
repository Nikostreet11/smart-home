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
	static Smartset* create();

	// destructor
	virtual ~Smartset();

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	int getSize();
	SmartItem* get(int index);
	SmartItem* get(const String& id);
	bool add(SmartItem* smartItem);
	bool remove(int index);

	// static constants
	static const int MAX_SMARTSETS = 1024;
	static const int MAX_SMART_ITEMS = 8;
	
private:
	// constructors
	Smartset();
	
	// static variables
	static int currentId;

	// resources
	LinkedPointerList<SmartItem> smartItems;
	
	// variables
	int id;
	String name;
};

#endif /* SMARTSET_H_ */
