#ifndef BINARY_H_
#define BINARY_H_

#include "Control.h"

class Binary : public Control
{
public:
	// constructor
	Binary();
	
	// destructor
	virtual ~Binary();
	
	// getters / setters
	virtual Type getType();
	virtual const String& getStringType() const;
	virtual void updatePort();
	int getValue();
	void setValue(int value);
	
private:
	// variables
	bool value;
};

#endif /* BINARY_H_ */
